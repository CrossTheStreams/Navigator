class CreateTermNodes < ActiveRecord::Migration
  def change
    create_table :term_nodes do |t|

      t.timestamps
    end
  end
end
