class StreamgraphController < ApplicationController


  def data
    data = TermDatum.streamgraph(params[:id])
    @graphdata = data[0]
    @labels = data[1]
    respond_to do |format|
    format.html
    format.json{
      render :json => @graphdata.to_json
      render :json => @labels.to_json
    }       
    end
  end

  def show
  end
end
