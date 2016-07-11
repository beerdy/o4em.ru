module Cookie
	def set_cookie(name,usercookie_id,token)
		headers = {'Content-Type' => 'text/html'}
		Rack::Utils.set_cookie_header!(headers, "name",          {:value => name,          :path => "/"})
		Rack::Utils.set_cookie_header!(headers, "usercookie_id", {:value => usercookie_id, :path => "/"})
		Rack::Utils.set_cookie_header!(headers, "token",         {:value => token,         :path => "/"})
		headers
	end
end