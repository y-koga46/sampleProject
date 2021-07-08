import { Component, OnInit } from '@angular/core';
import { todo } from 'src/interface/todo';
import { Service } from '../shared/service';
import { SELECT_LIST } from 'src/enum/select-list';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  todoList: any;
  clearCompleteTodo: any;
  itemsLeft = 0;

  SELECT_LIST = SELECT_LIST;
  selectList = SELECT_LIST.ALL;

  constructor(
    private service: Service
  ) { }

  /* 初期表示 */
  ngOnInit(): void {
    this.service.todoList$.subscribe(
      (todoData) => {
        this.itemsLeft = todoData.filter((todo: todo) => todo.status === SELECT_LIST.ACTIVE).length;
        this.clearCompleteTodo = todoData.filter((todo: todo) => todo.status === SELECT_LIST.COMPLETE);
      }
    )
  }

  /* タスク一覧フィルタ切替処理 */
  onClick(selectNumber: number) {
    this.service.selectList(selectNumber).subscribe(
      (data) => { this.selectList = data; }
    )
  };

  /* 完了タスク一括削除処理 */
  onClearComplete() {
    if (!this.clearCompleteTodo.length) {
      return
    };
    const clearIds = this.clearCompleteTodo.map((todo: todo) => {
      return todo.id;
    });

    this.service.deleteTodo(clearIds).subscribe();
  }
}
