var app = new Vue({
    el: '#app',
    data: {
      message: 'Hello Vue!',
      seen: true
    }
  })
  var app4 =new Vue({
      el:'#app-4',
      data:{
        todos: [
            { text: '学习 JavaScript' },
            { text: '学习 Vue' },
            { text: '整个牛项目' }
          ] 
      }
  })
  var app6=new Vue({
    el:'#app-6',
    data:{
        message: 'Hello Vue!'
    }
  })
  Vue.component('todo-item', {
    props: ['todo'],
    template: '<li>{{ todo.text }}</li>'
  })
  
  var app7 = new Vue({
    el: '#app-7',
    data: {
      groceryList: [
        { id: 0, text: '蔬菜' },
        { id: 1, text: '奶酪' },
        { id: 2, text: '随便其它什么人吃的东西' }
      ]
    }
  })