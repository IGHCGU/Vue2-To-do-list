const store = new Vuex.Store({
    state: {
        isLogin: localStorage.getItem('islogin') === 'true',
        todoList: JSON.parse(localStorage.getItem('todoList')) || [],
        doneTodos: JSON.parse(localStorage.getItem('doneTodos')) || []
    },

    mutations: {

        // 用户登录
        LOGIN(state) {
            state.isLogin = true;
            localStorage.setItem('islogin', 'true')
        },

        // 用户登出
        LOGOUT(state) {
            state.isLogin = false;
            localStorage.setItem('islogin', 'false')
        },

        // 添加待办事项
        ADD_TODO(state, todo) {
            state.todoList.push(todo)
            localStorage.setItem('todoList', JSON.stringify(state.todoList))
        },

        // 删除待办事项
        REMOVE_TODO(state, index) {
            state.todoList.splice(index, 1) // 删除指定索引
            localStorage.setItem('todoList', JSON.stringify(state.todoList))
        },

        // 添加已完成的待办事项
        ADD_DONE_TODO(state, doneTodo) {
            state.doneTodos.push(doneTodo)
            localStorage.setItem('doneTodos', JSON.stringify(state.doneTodos))
        },

        // 删除已完成的待办事项
        REMOVE_DONE_TODO(state, index) {
            state.doneTodos.splice(index, 1)
            localStorage.setItem('doneTodos', JSON.stringify(state.doneTodos))
        },

        //修改待办事项
        EDIT_TODO(state, { index, text, date }) {
            if (text !== null && text.trim() !== '') {
                state.todoList[index].text = text.trim();
            }
            if (date !== null && date.trim() !== '') {
                state.todoList[index].date = date.trim();
            }
            localStorage.setItem('todoList', JSON.stringify(state.todoList));
        },
    },

    actions: {
        // 10分钟后登录过期
        login({ commit }) {
            commit('LOGIN') // 调用mutations中的LOGIN方法，设置登录状态为true
            setTimeout(
                () => { commit('LOGOUT') }, 10 * 60 * 1000
            )
        },

    },

    getters: {

        // 获取列表
        isLogin(state) {
            return state.isLogin
        },

        todoList(state) {
            return state.todoList
        },

        doneTodos(state) {
            return state.doneTodos
        }

    }

})

const tem1 = {
    template: "#tem1",
    data() {
        return {
            username: '',
            password: '',
            timeoutId: null
        };
    },
    methods: {

        login() {
            if (this.username === '123' && this.password === '123') {
                this.$store.dispatch('login');
                this.$router.push('/home'); // 跳转到home页面
            } else if (this.username === '' || this.password === '') {
                alert('请输入用户名和密码');
            } else {
                alert('用户名或密码错误');
            }
        },

    }
}

let tem2 = {
    template: '#tem2',
    // 验证是否登录
    beforeRouteEnter(to, from, next) {
        const isLogin = localStorage.getItem('islogin') === 'true'; // 获取登录状态
        if (!isLogin) {
            next('/');
        } else {
            next();
        }
    },

    data() {
        return {
            inputText: "",
            inputDate: "",
        };
    },

    methods: {
        formatDate(dateString) {
            const date = new Date(dateString);
            const year = date.getFullYear();
            // getMonth() 返回的月份是从0开始的，因此需要 +1
            const month = date.getMonth() + 1;
            const day = date.getDate();
            // 使用模板字符串拼接出日期，并添加年月日
            return `${year}年${month}月${day}日`;
        },
        submit() {
            if (this.inputText.trim() !== '' && this.inputDate !== '') { // 判断输入的待办事项和时间是否为空
                const newTodo = {
                    text: this.inputText,
                    date: this.inputDate,
                    completed: false,
                };
                this.$store.commit('ADD_TODO', newTodo)
                // 清空输入
                this.inputText = ''
                this.inputDate = ''

            } else {
                alert('请输入待办事项和时间')
            }
        },

        deleteTodo(index) {
            this.$store.commit('REMOVE_TODO', index)
        },

        deleteDone(index) {
            this.$store.commit('REMOVE_DONE_TODO', index)
        },

        finishTodo(index) {
            const finishedTodo = this.$store.state.todoList.splice(index, 1)[0]
            finishedTodo.completed = true;
            // 更新数据到本地
            this.$store.commit('ADD_DONE_TODO', finishedTodo)
            localStorage.setItem('doneTodos', JSON.stringify(this.$store.state.doneTodos))
            localStorage.setItem('todoList', JSON.stringify(this.$store.state.todoList))

        },

        editTodo(index, item) {
            let updatedText = prompt('编辑待办事项的文本', item.text);
            let updatedDate = prompt('编辑待办事项的日期', item.date);

            // 判断是否有更新
            if ((updatedText !== null && updatedText.trim() !== '') || (updatedDate !== null && updatedDate.trim() !== '')) {
                this.$store.commit('EDIT_TODO', {
                    index: index,
                    text: updatedText,
                    date: updatedDate
                });
            }
        },
    },

    // 实例创建后
    created() {
        if (this.$store.state.todoList.length === 0) { // 办事项列表为空的情况
            const storedTodoList = localStorage.getItem('todoList');
            if (storedTodoList) {
                const todos = JSON.parse(storedTodoList)
                todos.forEach(
                    (todo) => { this.$store.commit('ADD_TODO', todo) } //逐个将待办事项添加到待办事项列表中
                )
            }
        }
    },



    // 过滤列表
    computed: {
        // 获取待办事项列表
        toDos() {
            return this.$store.getters.todoList;
        },
        // 获取已完成的待办事项列表
        done() {
            return this.$store.getters.doneTodos;
        }
    }
}


let router = new VueRouter({
    routes: [
        { path: "/", component: tem1 },
        { path: "/home", component: tem2 },
    ],
})





let vm = new Vue({
    el: "#app",
    store,
    router
})
