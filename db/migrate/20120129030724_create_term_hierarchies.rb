class CreateTermHierarchies < ActiveRecord::Migration
  def change
    create_table :term_hierarchies do |t|

      t.timestamps
    end
  end
end
