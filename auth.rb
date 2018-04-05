require 'httpclient'
require 'net/https'
require 'uri'

#require 'httpclient'

uri = "https://api.vk.com/method/getProfiles?access_token=c813625a0985c1d96725468d7734641322d97e57ec90ee5991071752258ee37a9df88791cd4ff6cd8b8ba"

puts HTTPClient.get_content(uri)

#puts HTTPClient.get_content(uri)

puts 'ok'
