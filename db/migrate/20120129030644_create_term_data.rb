class CreateTermData < ActiveRecord::Migration
  def change
    create_table :term_data do |t|

      t.timestamps
    end
  end
end
