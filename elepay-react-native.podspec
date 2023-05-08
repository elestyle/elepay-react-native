require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "elepay-react-native"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.description  = <<-DESC
                  A React Native module for elepay mobile SDK.
                   DESC
  s.homepage     = "https://elepay.io"
  s.license      = "MIT"
  s.authors      = { "elestyle, Inc." => "info@elestyle.jp" }
  s.platforms    = { :ios => "12.0" }
  s.source       = { :git => "https://github.com/elestyle/elepay-react-native", :tag => "#{s.version}" }

  s.source_files = "ios/**/*.{h,m,swift}"
  s.requires_arc = true

  s.dependency "React"
  s.dependency "ElepaySDK", "4.1.0"
end
