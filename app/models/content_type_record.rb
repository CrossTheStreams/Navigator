class ContentTypeRecord < ActiveRecord::Base

  set_table_name 'content_type_record'

  has_many :term_nodes, :foreign_key => :nid, :primary_key => :nid
  has_many :term_data, :through => :term_nodes

  has_one :node, :foreign_key => :nid, :primary_key => :nid


end
