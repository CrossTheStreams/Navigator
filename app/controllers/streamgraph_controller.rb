class StreamgraphController < ApplicationController

  before_filter :get_data_and_labels, :get_all_datasets_and_labels

  def all_datasets
    @all_datasets
    respond_to do |format|
      format.html{
        render :json => {"all_datasets" => @all_datasets_and_labels[0], "all_labels" => @all_datasets_and_labels[1]}
      }
    end 
  end

  def all_labels
    @all_labels
      respond_to do |format|
      format.json{
        render :json => @all_labels
      }
      end
  end

  def countries
    @countries_and_nids = TermHierarchy.array_by_parent(5)
    @countries = @countries_and_nids
    respond_to do |format|
    format.html{
      render :json => @countries.to_json
    }       
    end
  end

  def data
    @graphdata
    respond_to do |format|
    format.html{
      render :json => {"datasets" => @datasets_and_labels[0], "labels" => @datasets_and_labels[1]}
    }       
    end
  end

  def labels
    @labels
    respond_to do |format|
      format.json{
        render :json => @labels
      }
    end
  end

  def show
  end

protected

  def get_data_and_labels
    data_and_labels = TermDatum.streamgraph(params[:id])
    @datasets_and_labels = data_and_labels
  end

  def get_all_datasets_and_labels
    data_and_labels = ContentTypeRecord.streamgraph
    @all_datasets_and_labels = data_and_labels
  end
end

