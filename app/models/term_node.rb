class TermNode < ActiveRecord::Base
  
  set_table_name 'term_node'

  belongs_to :content_type_record, :foreign_key => :nid, :primary_key => :nid
  belongs_to :term_datum, :foreign_key => :tid, :primary_key => :tid

  
end
