# Example 调试说明

`example` 是基于 Expo 的调试工程，已配置为通过 Bun link 使用仓库根目录的本地包 `elepay-react-native`（`link:elepay-react-native`）。

## 安装依赖

```bash
cd ..
bun link

cd example
bun install
```

可用以下命令确认已链接本地包：

```bash
bun pm ls elepay-react-native
```

## iOS 调试

```bash
cd example
bun ios
```

## Android 调试

```bash
cd example
bun android
```

## 启动 Metro

```bash
cd example
bun start --clear
```

已新增 `example/metro.config.js`，用于监听上级目录并支持本地软链接包的实时调试。
