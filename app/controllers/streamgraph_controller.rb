class StreamgraphController < ApplicationController

  before_filter :get_data_and_labels, :get_all_datasets_and_labels

  def all_datasets
    @all_datasets
    respond_to do |format|
      format.json{
        render :json => @all_datasets
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
    @countries = @countries_and_nids #.map {|a| a[0]}
    respond_to do |format|
    format.json{
      render :json => @countries.to_json
    }       
    end
  end

  def data
    @graphdata
    respond_to do |format|
    format.json{
      render :json => @graphdata
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
    data = TermDatum.streamgraph(params[:id])
    @graphdata = data[0]
    @labels = data[1]
  end

  def get_all_datasets_and_labels
    data = ContentTypeRecord.streamgraph
    @all_datasets = data[0]
    @all_labels = data[1]
  end
end
