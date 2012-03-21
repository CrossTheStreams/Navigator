class Vocabulary < ActiveRecord::Base
  set_table_name 'vocabulary'
  has_many :term_data, :foreign_key => :vid, :primary_key => :vid
end
