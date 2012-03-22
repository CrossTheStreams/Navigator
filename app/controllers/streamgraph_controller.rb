class StreamgraphController < ApplicationController


  def countries
    @countries_and_nids = TermHierarchy.array_by_parent(5)
    @countries = @countries_and_nids.map {|a| a[0]}
    respond_to do |format|
    format.json{
      render :json => @countries.to_json
    }       
    end
  end

  def data
    data = TermDatum.streamgraph(params[:id])
    @graphdata = data[0]
    @labels = data[1]
    respond_to do |format|
    format.json{
      render :json => @graphdata.to_json
      render :json => @labels.to_json
    }       
    end
  end

  def show
  end
end
