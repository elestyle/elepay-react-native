# Expo vs React Native：原生模块 Autolinking 机制对比

> 案例：`elepay-react-native`（传统 RN 原生模块）

---

## 1. 两套 Autolinking 机制

| 机制 | 发现入口 | 扫描工具 |
|---|---|---|
| **RN CLI Autolinking**（RN 0.60+） | `*.podspec` / `ReactPackage` 实现类 | `react-native config` |
| **Expo Modules Autolinking** | `expo-module.config.json` | `expo-modules-autolinking` |

历史上两者共存且互不冲突——各自扫描不同标识文件。**但 Expo SDK 52 起，Expo Autolinking 已统一接管两套系统**，同时处理 Expo 模块和传统 RN 模块（可通过 `EXPO_USE_COMMUNITY_AUTOLINKING=1` 切换回旧行为）。

---

## 2. RN CLI Autolinking

> **注意：** 本节描述的是 **Legacy Architecture**（旧架构）下的模式。RN 0.76 起 New Architecture 已默认启用，RN 0.82 起旧架构已永久禁用。现有 legacy 模块仍可通过 **Interop Layer（互操作层）** 在新架构上运行，但新模块应使用 TurboModules。详见[第 6 节](#6-new-architecture-的影响)。

### 发现规则

- **iOS**：包根目录下的 `*.podspec`
- **Android**：`android/src/` 中的 `ReactPackage` 实现类
- 可选：`react-native.config.js` 显式声明路径

### 注册链路

```
npm install → react-native config 扫描 node_modules
  ├─ iOS:  *.podspec → pod install 自动链接
  └─ Android: ReactPackage → 注册到 PackageList
       ↓
  原生编译 → JS 侧 NativeModules.XXX 可用
```

### 关键文件

| 文件 | 角色 |
|---|---|
| `*.podspec` | iOS CocoaPods 发现入口 |
| `ReactPackage` 实现类 | Android 模块注册 |
| `ReactContextBaseJavaModule` 子类 | Android 模块实现，`getName()` = JS 侧名称 |
| `RCT_EXTERN_MODULE` / `RCT_EXTERN_REMAP_MODULE` | iOS ObjC 桥接宏 |
| `react-native.config.js` | （可选）显式声明原生代码路径 |

### 实例：elepay-react-native

```
elepay-react-native/
├── index.js                          # JS 桥接（3 行）
├── elepay-react-native.podspec       # iOS 发现入口
├── android/
│   ├── build.gradle                  # 依赖 jp.elestyle.androidapp:elepay
│   └── src/main/java/com/reactlibrary/
│       ├── RnElepayPackage.kt        # ReactPackage
│       ├── RnElepayModule.kt         # ReactContextBaseJavaModule
│       └── RnElepayResult.kt
└── ios/
    ├── RnElepay.m                    # ObjC 桥接宏
    └── RnElepay.swift                # Swift 实现
```

**JS 入口：**

```js
import { NativeModules } from "react-native";
const { Elepay } = NativeModules;
export default Elepay;
```

**Android 注册：**

```kotlin
class RnElepayPackage : ReactPackage {
    override fun createNativeModules(ctx: ReactApplicationContext) =
        mutableListOf(RnElepayModule(ctx))
}

class RnElepayModule(ctx: ReactApplicationContext) : ReactContextBaseJavaModule(ctx) {
    override fun getName() = "Elepay"

    @ReactMethod
    fun initElepay(configs: ReadableMap) { /* ... */ }
}
```

**iOS 注册：**

```objc
@interface RCT_EXTERN_REMAP_MODULE(Elepay, ElepayModule, NSObject)
RCT_EXTERN_METHOD(initElepay:(NSDictionary *)configs)
RCT_EXTERN_METHOD(handlePaymentWithPayload:(NSString *)payload resultHandler:(RCTResponseSenderBlock)callback)
@end
```

---

## 3. Expo Modules Autolinking

### 发现规则

查找含 `expo-module.config.json` 的包。**无此文件 = 不被识别。**

- **SDK 53 及之前**：直接扫描 `node_modules/` 和本地模块目录（默认 `./modules/`）。
- **SDK 54 起**：改为**基于依赖解析**（dependency resolution），不再扫描 `node_modules` 文件夹。模块必须在 `dependencies` 或 `peerDependencies` 中声明才会被链接。可通过 `expo.autolinking.legacy_shallowReactNativeLinking: true` 恢复旧行为。

### 注册链路

```
npm install → expo-modules-autolinking 扫描 expo-module.config.json
  ├─ iOS:  ExpoModulesCore 加载
  └─ Android: ExpoModulesCorePlugin 实例化 Module 类
       ↓
  运行时 Name("XXX") 注册 → JS 侧 requireNativeModule('XXX') 可用
```

### 关键文件

| 文件 | 角色 |
|---|---|
| `expo-module.config.json` | 唯一发现入口，声明平台与模块类名 |
| `Module()` 子类（Kotlin） | Android 实现，Expo DSL |
| Swift Module 文件 | iOS 实现，Expo Module API |

### 示例

```json
// expo-module.config.json
{
  "platforms": ["apple", "android"],
  "android": { "modules": ["expo.modules.mymodule.MyExpoModule"] }
}
```

```kotlin
class MyExpoModule : Module() {
    override fun definition() = ModuleDefinition {
        Name("MyModule")
        Function("hello") { name: String -> "Hello, $name!" }
    }
}
```

```typescript
// SDK 53+ 推荐写法（从 expo 包导入）
import { requireNativeModule } from "expo";
// 旧写法（仍可工作）: import { requireNativeModule } from "expo-modules-core";
export default requireNativeModule<MyModuleType>("MyModule");
```

---

## 4. 核心差异

| 维度 | RN CLI（Legacy Architecture） | RN TurboModules（New Architecture） | Expo Modules Autolinking |
|---|---|---|---|
| 发现入口 | `*.podspec` + `ReactPackage`（启发式） | 同左 + `codegenConfig` in `package.json` | `expo-module.config.json`（显式声明） |
| Android 基类 | `ReactContextBaseJavaModule` | Codegen 生成的 `NativeXxxSpec` | `expo.modules.kotlin.modules.Module` |
| Android 注册 | `ReactPackage.createNativeModules()` | `TurboReactPackage` | `ModuleDefinition { Name("...") }` DSL |
| iOS 桥接 | ObjC 宏（`RCT_EXTERN_MODULE`） | Codegen spec 协议 + `getTurboModule:` | Expo Module API（Swift first） |
| JS 桥接 | `NativeModules.XXX` | `TurboModuleRegistry.getEnforcing<Spec>()` | `requireNativeModule('XXX')` |
| Expo Go | 不兼容 | 不兼容 | 仅内置模块兼容 |
| 状态 | Legacy（0.82 起旧架构永久禁用） | 0.76 起默认，0.82 起唯一选项 | 当前推荐 |

---

## 5. 在 Expo 项目中使用传统 RN 原生模块

**前提：** 必须使用 `expo prebuild` 或 custom dev client，不能用 Expo Go。

`prebuild` 后传统 RN 原生模块可正常使用。SDK 52 起 Expo Autolinking 统一处理 Expo 模块和传统 RN 模块；SDK 51 及之前则是两套 autolinking 各自独立运行。

### 额外原生配置

部分模块需要额外配置（maven 仓库、Manifest 修改等），通过 Config Plugin 实现：

```js
// app.config.js
module.exports = {
  plugins: [
    "elepay-react-native",          // 包自带的 config plugin
    "./plugins/withElepayMaven.js",  // 或自定义 plugin
  ],
};
```

例如 `elepay-react-native` 需要额外 maven 源：

```groovy
maven { url "https://elestyle.github.io/elepay-android/repository" }
```

无内置 config plugin 时需自行编写，或 `prebuild` 后手动修改原生工程。

### 判断 npm 包类型

```
有 expo-module.config.json？ → Expo Module
有 *.podspec + android/ ?    → 传统 RN 原生模块
都没有？                      → 纯 JS 模块
```

---

## 6. New Architecture 的影响

> RN 0.76（2024.10）起 New Architecture 默认启用；RN 0.82（2025.10）起旧架构永久禁用。

### 传统模块的兼容性

传统 RN 原生模块（如 `elepay-react-native`）在新架构上通过 **Interop Layer（互操作层）** 自动兼容，无需修改代码。互操作层暂无明确移除时间表，但属于技术债务，建议新模块直接使用 TurboModules。

### 新架构模块开发方式

```
TypeScript/Flow Spec 定义 → Codegen 生成原生绑定 → 原生代码实现生成的接口
```

- **Android**：继承 Codegen 生成的 `NativeXxxSpec`（而非 `ReactContextBaseJavaModule`）
- **iOS**：实现 Codegen 生成的 spec 协议 + `.mm` 文件中的 `getTurboModule:`
- **JS**：`TurboModuleRegistry.getEnforcing<Spec>('XXX')`（而非 `NativeModules.XXX`）
- **配置**：`package.json` 中的 `codegenConfig` 字段

### 判断库是否已适配 New Architecture

检查库的 `package.json` 中是否有 `codegenConfig` 字段：有则已适配，无则通过互操作层运行。

---

## 7. FAQ

| 问题 | 结论 |
|---|---|
| `elepay-react-native` 是 Expo Module 吗？ | 否，传统 RN 原生模块 |
| 能在 Expo 项目中使用吗？ | 能，需 prebuild / custom dev client |
| 两套 autolinking 会冲突吗？ | 不会。SDK 52 起 Expo Autolinking 已统一接管 |
| 传统 RN 模块在 RN 0.82+ 上还能用吗？ | 能，通过 Interop Layer 兼容，但建议迁移到 TurboModules |
| 如何判断库是否已适配 New Architecture？ | 检查 `package.json` 中是否有 `codegenConfig` 字段 |
