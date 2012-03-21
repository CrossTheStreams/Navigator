# Load the rails application
require File.expand_path('../application', __FILE__)
# Initialize the rails application
Navigator::Application.initialize!

##Set table name to singular in ActiveRecord
#ActiveRecord::Base.use_pluralization = false
