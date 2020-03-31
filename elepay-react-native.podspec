require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "elepay-react-native"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.description  = <<-DESC
                  react-native-rn-elepay
                   DESC
  s.homepage     = "https://elepay.io"
  s.license      = "MIT"
  # s.license    = { :type => "MIT", :file => "FILE_LICENSE" }
  s.authors      = { "elestyle, Inc." => "info@elestyle.jp" }
  s.platforms    = { :ios => "9.0" }
  s.source       = { :git => "https://github.com/elestyle/elepay-react-native", :tag => "#{s.version}" }

  s.source_files = "ios/**/*.{h,m,swift}"
  s.requires_arc = true

  s.dependency "React"
  s.dependency "ElePay", "1.7.7"
  s.dependency "ElePay-ChinesePayments-Plugin"
  s.dependency "Braintree"
end

