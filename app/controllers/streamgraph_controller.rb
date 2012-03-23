class StreamgraphController < ApplicationController

  before_filter :get_data_and_labels

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
end
