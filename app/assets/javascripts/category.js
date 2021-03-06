$(function(){



  // カテゴリーセレクトボックスのオプションを作成
  function appendOption(category){
    var html = `<option value="${category.id}" data-category="${category.id}">${category.name}</option>`
    return html;  //appendOptionにhtmlを返す
  }



  // 子カテゴリーの表示作成
  function appendChidrenBox(insertHTML){
    var childSelectHtml = '';
    childSelectHtml = `
                        <div class='main__box__detail__category__form__box'  id= 'children_wrapper'>
                          <select class="listing-select-wrapper__box--select" id="child_category" name="" required="required">
                            <option value="---" data-category="---">---</option>
                            ${insertHTML}
                          <select>
                        </div>`;
    $('.main__box__detail__category__form').append(childSelectHtml);
  }



  // 孫カテゴリーの表示作成
  function appendGrandchidrenBox(insertHTML){
    var grandchildSelectHtml = '';
    grandchildSelectHtml = `<div class='main__box__detail__category__form__box' id= 'grandchildren_wrapper'>
                              <select class="listing-select-wrapper__box--select" id="grandchild_category" name="category_id" required="required">
                                <option value="---" data-category="---">---</option>
                                  ${insertHTML}
                              </select>
                            </div>`;
    $('.main__box__detail__category__form').append(grandchildSelectHtml);
  }



  // 親カテゴリー選択後のイベント
  //親カテゴリーの値が変更されたら発火
  $('#parent_category').on('change', function(){
    //選択された親カテゴリーの名前(内容)を.valueで取得
    var parentCategory = document.getElementById('parent_category').value;

    //親カテゴリーが初期値でないことを確認
    if (parentCategory != "---"){
      $.ajax({
        url: 'get_category_children',   //items_controllerのメソッドへ
        type: 'GET',
        data: { parent_name: parentCategory },
        dataType: 'json'
      })
      .done(function(children){  //childrenの中には、選ばれた親カテゴリの中の小カテゴリが入っている
        $('#children_wrapper').remove(); //親が変更された時、子以下を削除するする
        $('#grandchildren_wrapper').remove();
        var insertHTML = '';
        children.forEach(function(child){  //childには、子カテゴリのidとnameが入っている
          insertHTML += appendOption(child);   
        });
        appendChidrenBox(insertHTML);   //上にあるfunction
      })
      .fail(function(){
        alert('カテゴリー取得に失敗しました');
      })
    }else{
      $('#children_wrapper').remove(); //親カテゴリーが初期値になった時、子以下を削除するする
      $('#grandchildren_wrapper').remove();
      $('#size_wrapper').remove();
      $('#brand_wrapper').remove();
    }
  });




  // 子カテゴリー選択後のイベント
  $('.main__box__detail__category__form').on('change', '#child_category', function(){
    var childId = $('#child_category option:selected').data('category'); //選択された子カテゴリーのidを取得
    if (childId != "---"){ //子カテゴリーが初期値でないことを確認
      $.ajax({
        url: 'get_category_grandchildren',
        type: 'GET',
        data: { child_id: childId },
        dataType: 'json'
      })
      .done(function(grandchildren){
        if (grandchildren.length != 0) {
          $('#grandchildren_wrapper').remove(); //子が変更された時、孫以下を削除するする
          $('#size_wrapper').remove();
          $('#brand_wrapper').remove();
          var insertHTML = '';
          grandchildren.forEach(function(grandchild){
            insertHTML += appendOption(grandchild);
          });
          appendGrandchidrenBox(insertHTML);
        }
      })
      .fail(function(){
        alert('カテゴリー取得に失敗しました');
      })
    }else{
      $('#grandchildren_wrapper').remove(); //子カテゴリーが初期値になった時、孫以下を削除する
      $('#size_wrapper').remove();
      $('#brand_wrapper').remove();
    }
  });



});
