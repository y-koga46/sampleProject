import { Component, OnInit } from '@angular/core';
import { Service } from '../shared/service';
import { SELECT_LIST } from 'src/enum/select-list';
SELECT_LIST

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  todoList: any;
  selectList = SELECT_LIST.ALL;
  error: any;
  SELECT_LIST = SELECT_LIST;

  constructor(
    private service: Service
  ) {
    this.todoList = [];
  }

  /* todo初期表示 */
  ngOnInit(): void {
    this.service.getTodoList().subscribe(
      (todoData) => (this.todoList = todoData)
    )

    this.service.selectList(SELECT_LIST.ALL).subscribe(
      (data) => { this.selectList = data }
    );
  }

  /* タスクステータス変更処理 */
  onChange(id: number, status: number) {
    const changeStatus = status ? SELECT_LIST.ACTIVE : SELECT_LIST.COMPLETE;
    this.service.checkTodo(id, changeStatus).subscribe();
  }

  /* タスク削除処理 */
  onDelete(id: number) {
    this.service.deleteTodo([id]).subscribe();
  }
}
