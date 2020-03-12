class ItemsController < ApplicationController
  def index
    @items = Item.includes(:user)
  end

  def new
    @item = Item.new
    @item.images.new
    @category_parent_array = Category.roots.pluck(:name)


  end

  def create
    @item = Item.new(item_params)
    if @item.save
		  redirect_to root_path
	  else
	    redirect_to new_item_path  #itemをセーブできなかった時
    end
    

  end

  def show
    @items = Items.find(params[:id])
  end

  def edit
    
  end

  def destroy
    
  end

  def confirm

  end

  def search
    respond_to do |format|
      format.html
      format.json do
      end
    end
  end
  



  def get_category_children
    @category_children = Category.find_by(name: "#{params[:parent_name]}", ancestry: nil).children
    # find_byの検索においてnameとancestryで検索している理由は、parent_nameが複数あったときのための保険
    #parent_nameはJSから取ってきている
 end


  def get_category_grandchildren
      @category_grandchildren = Category.find("#{params[:child_id]}").children
  end

  def get_delivery_method
    
  end


  private

  def item_params
    params.require(:item).permit(:name, :description, :price, :ship_charge, :ship_area, :ship_date, :ship_method, :category_id, images_attributes: [:image]).merge(user_id: current_user.id).merge(category_id: params[:category_id])
    
  end
end

