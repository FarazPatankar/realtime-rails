class StaticPagesController < ApplicationController
	def hi
		# require 'pry';binding.pry
		str = 'Hello'
		$redis.publish('chat message', params[:message].to_json)
		render json: str
	end
end
