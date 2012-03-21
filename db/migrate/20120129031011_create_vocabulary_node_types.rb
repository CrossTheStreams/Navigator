class CreateVocabularyNodeTypes < ActiveRecord::Migration
  def change
    create_table :vocabulary_node_types do |t|

      t.timestamps
    end
  end
end
