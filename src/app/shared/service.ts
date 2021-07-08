import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from "rxjs";
import { mergeMap } from 'rxjs/operators';
import { todo } from "src/interface/todo";

@Injectable()
export class Service {
    /* Todoリスト一覧 */
    private _todoList$: BehaviorSubject<any> = new BehaviorSubject([]);
    public todoList$: Observable<any> = this._todoList$.asObservable();

    /* フィルタ関連 */
    private _selectList$: BehaviorSubject<any> = new BehaviorSubject([]);
    public selectList$: Observable<any> = this._selectList$.asObservable();

    constructor(
        private http: HttpClient,
    ) { }

    /**
     * todoList取得API
     */
    getTodoList(): Observable<any> {
        return this.http.get('api/init').pipe(
            mergeMap((data: any) => {
                this._todoList$.next(data);
                this.todoList$ = this._todoList$.asObservable();
                return this.todoList$;
            }
            )
        )
    }

    /**
     * todo追加API
     * @param todo 追加するtodo
     */
    addTodo(todo: any): Observable<todo> {
        return this.http.post('api/add', { title: todo }).pipe(
            mergeMap((data) => {
                const current = this._todoList$.getValue();
                this._todoList$.next([...current, data]);
                return this.todoList$;
            })
        )
    }

    /**
     * チェックボックスの切替API
     * @param id todoId
     * @param status チェックボックスstatus
     */
    checkTodo(id: number, status: number): Observable<todo> {
        return this.http.put(`api/check/${id}`, { status }).pipe(
            mergeMap(() => {
                const current = this._todoList$.getValue().map((todo: todo) => {
                    if (todo.id === id) {
                        return { ...todo, status: status };
                    }
                    return todo;
                })
                this._todoList$.next(current);
                return this.todoList$;
            })
        )
    }

    /**
     * Todoの削除API
     * @param ids 削除するTodoID
     */
    deleteTodo(ids: any): Observable<todo> {
        return this.http.delete(`api/delete/${ids}`).pipe(
            mergeMap(() => {
                const current = this._todoList$.getValue();
                const filterCurrent = current.filter((todo: todo) => (!ids.includes(todo.id)));

                this._todoList$.next(filterCurrent);
                return this.todoList$;
            })
        )
    }

    /**
     * Todoリストの表示切替処理
     */
    selectList(selectNumber: number): Observable<number> {
        this._selectList$.next(selectNumber);
        return this.selectList$;
    }
}