class CreateTermRelations < ActiveRecord::Migration
  def change
    create_table :term_relations do |t|

      t.timestamps
    end
  end
end
