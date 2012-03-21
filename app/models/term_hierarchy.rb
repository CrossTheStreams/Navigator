class TermHierarchy < ActiveRecord::Base
  set_table_name 'term_hierarchy'
  has_many :term_data, :foreign_key => :tid, :primary_key => :tid


  def self.array_by_parent(parent)

    tids = self.where({:parent => parent})

    @array_by_parent = TermDatum.where{tid.in(tids.select{tid})}.map {|x| [x.name, x.tid]}
    
   # TermDatum.where{tid.in = tids}.map {|x| [x.name, x.tid]}
     #self.where({:parent => parent}) {|arg| arg}.flatten.map {|x| x.name}.sort_alphabetical
  end

end
