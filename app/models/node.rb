class Node < ActiveRecord::Base
  set_table_name 'node'

  set_inheritance_column :ruby_type

  def my_changed 
    self['changed'] 
  end 
  def my_changed=(value) 
    self['changed'] = value 
  end 

  class << self # Class methods 
    alias :all_columns :columns 
    def columns 
      all_columns.reject {|c| c.name == 'changed'} 
    end 
  end 

  belongs_to :content_type_record, :foreign_key => :nid, :primary_key => :nid

end
