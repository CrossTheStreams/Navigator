class CreateVocabularies < ActiveRecord::Migration
  def change
    create_table :vocabularies do |t|

      t.timestamps
    end
  end
end
