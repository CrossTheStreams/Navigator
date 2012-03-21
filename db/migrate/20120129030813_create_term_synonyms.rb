class CreateTermSynonyms < ActiveRecord::Migration
  def change
    create_table :term_synonyms do |t|

      t.timestamps
    end
  end
end
