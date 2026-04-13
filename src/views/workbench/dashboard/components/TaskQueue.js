class TaskQueue {
  constructor(max) {
    this.max = max; // 并发数
    this.min = 0;
    this.taskList = []; // 全部任务
    Promise.resolve().then(() => this.run()) // 等同步代码(addTask)全部执行完成，再执行run
  }

  // 增加任务
  addTask(task) {
    this.taskList.push(task);
  }

  // 执行任务
  async run() {
    if (!this.taskList.length) return;
    const AsyncTasks = [];
    this.min = Math.min(this.max, this.taskList.length) // 当传入的并发数大于任务数，取任务数， 反之取并发数
    // 根据并发数分组
    for(let i = 0; i < this.min; i++) {
      AsyncTasks.push(this.taskList.shift());
    }
    await this.handleTask(AsyncTasks); // 通过下面递归，这里将会有6个异步任务串联执行

    this.run(); // 递归
  }

  async handleTask(tasks) {
    // 返回promise处理异步任务组
    return new Promise(resolve => {
      // 遍历任务组，5个异步任务并联执行
      tasks.forEach(async (task, index) => {
        await task().then(res => {
          console.log(res);
        }).catch((err) => {
          console.log(err);
        }).finally(() => {
          // index + 1 === this.min && console.log('===============================');
          index + 1 === this.min && resolve() // 最后一个任务resolve()，promise完成
        })
      })
    })
  }
}

export default TaskQueue;
