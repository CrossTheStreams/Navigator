class CreateContentTypeRecords < ActiveRecord::Migration
  def change
    create_table :content_type_records do |t|

      t.timestamps
    end
  end
end
