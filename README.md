# Container Registryのプッシュ＆インスタンス作成

## 参考サイト手順

- [GCE上でContainer-Optimized OSを使ってコンテナバッチ処理する方法](https://curicle.commu.co.jp/ticket/75471c/1730/)
- 上記サイトからGithubのプロジェクトをダウンロードしたもので、下記の手順を進めてください。
- コマンドはダウンロードしたプロジェクトのルートディレクトリで実行してください。

## 設定ファイル

- `.param`をプロジェクトのルートディレクトリへ作成して以下を記載する。

```
SERVICE_ACCOUNT=default　#とりあえずdefaultで指定していますが、本番は変更してください。
PROJECT_ID=stg-movicle
MACHINE_TYPE=n1-standard-1
```

- `credential.json`プロジェクトのルートディレクトリへ配置してください。
※ stg-movicleのcredentialファイルは責任者に確認してください。
- `.env`をプロジェクトのルートディレクトリへ作成して以下を記載する。

```
GOOGLE_APPLICATION_CREDENTIALS=../credential.json
# main.pyから見たcredential.jsonのpathを記載してください。

```

## GCP Container RegistryへDockerファイルをプッシュする。

- DockerfileをGCRへプッシュする。

```bash
$ gcloud auth configure-docker
$ sh scripts/build_and_push.sh <イメージ名> <タグ>
# イメージ名、タグ名は何でもOKです。
```

- GCPのGCP Container Registryへ追加されていればOKです。

## VMインスタンスの起動とコンテナのでデプロイ

- VMインスタンスを起動コマンド時にプッシュしたDockerイメージをデプロイする。

```bash
$ sh scripts/deploy_container.sh <サービス名> <イメージ名> <タグ>
# サービス名は作成するインスタンス名（何でもOK）、イメージ名、タグ名は上記でプッシュした際に使用したものを記載。
```

- GCEのVMインスタンスを確認して、インスタンスが削除されれば完了です。

## インスタンス削除失敗時のログ確認方法

- GCEので作成されたVMインスタンスのSSH横の矢印を押して、`ブラウザ ウィンドウで開く`でSSH接続する。
- SSH接続後、下記コマンドでDockerのログ等を確認する。

```bash
$ docker ps -a
# コンテナが正常に起動しているのかを確認

$ docker logs <イメージID>
#ログを確認して、エラー箇所を確認
```

## M1 Mac 注意点

- M1 macでDockerfileをビルドした場合は、docker run時にサーバー側のCPUアーキテクチャの違いでエラーが発生する場合がある。
- エラーが発生した場合は、`build_and_push.sh`ファイルのdockerのbuildコマンドを以下のように変更する。

```bash
$ docker buildx build --platform linux/amd64 -t ${image}:${tag} .
```

## ■**Container Registryのプッシュ手順**

- ローカルに作成したDocker imageをContainer Registoryにプッシュ手順

※ gcloudインストール済み、auth設定済みなこと

```bash
$ docker buildx build --platform linux/amd64 -t <イメージ名>:<タグ名> .
# dockerfileをビルド（すでにdockerimageがある場合は不要）
$ docker tag <イメージ名>:<タグ名> <フルネーム>
# GCPイメージ用にタグ付け
$ docker push <フルネーム>

#↓今回の例
$ docker buildx build --platform linux/amd64 -t pubsub .
$ docker tag pubsub:latest gcr.io/stg-movicle/pubsub:latest
$ docker push gcr.io/stg-movicle/pubsub:latest
```
