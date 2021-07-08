import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Service } from '../shared/service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  form = new FormGroup({
    addTodo: new FormControl('', Validators.required)
  });

  constructor(
    private service: Service
  ) { }

  ngOnInit(): void {
  }

  /* Todo追加処理 */
  onSubmit() {
    this.service.addTodo(this.form.value.addTodo).subscribe(
      () => this.form.reset()
    )
  }
}
