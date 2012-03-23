class TermDatum < ActiveRecord::Base
  
  belongs_to :vocabulary, :foreign_key => :vid, :primary_key => :vid

  has_many :term_nodes, :foreign_key => :tid, :primary_key => :tid
  has_many :content_type_records, :through => :term_nodes
  has_many :term_hierarchies, :foreign_key => :tid, :primary_key => :tid
  
  
  def self.all_with_vid(vid)
    
    

  end

  def self.streamgraph(tid)

    term = TermNode.joins{term_datum}.where({:tid => tid})

    #Two dimensional array with start date, end date, and dataset type.

    dates_by_type_array = ContentTypeRecord.where{nid.in(term.select{nid})}.order("field_type_value").map do |dataset|

      [dataset.field_time_period_covered_value[0..3].to_i, 
          dataset.field_time_period_covered_value2[0..3].to_i, 
          dataset.field_type_value]
      
    end

    #To store labels and indices for dataset types.

    column_labels = dates_by_type_array.map {|dataset| dataset[2]}.uniq.sort

    column_label_hash = Hash.new

    column_labels.each_with_index {|type, i| column_label_hash[type] = i}

    #To start graph from arbitrary date and end with current year.

    t = Time.now

    graph_start_year = 1950

    year_rows = (t.year + 1 - graph_start_year)

    #Array for Streamgraph.js...

    array_for_json = Array.new(year_rows) {Array.new(column_labels.count, 0)}

    #Iteration for array_for_json

    row_iteration = lambda do |start_index, end_index, col_id| 
      ([0, start_index].max..[year_rows, end_index].min).each do |row_id| 
        array_for_json[row_id][col_id] += 1
      end
    end
      
    dates_by_type_array.each do |start_year, end_year, type|

        col_id = column_label_hash[type]

        start_year -= graph_start_year
        end_year -= graph_start_year

        row_iteration.call(start_year, end_year, col_id)
    
    end

    #Did I say Streamgraph.js? I meant d3.js.

    [array_for_json.transpose, column_labels]
  end
end

    



