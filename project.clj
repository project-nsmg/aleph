(defproject aleph "0.1.0-SNAPSHOT"

  :description "A galaxy civilization simulation game."
  :url "https://github.com/project-nsmg/aleph"

  :dependencies [[org.clojure/clojure "1.6.0"]
                 [ring-server "0.4.0"]
                 [selmer "0.8.2"]
                 [com.taoensso/timbre "3.4.0"]
                 [com.taoensso/tower "3.0.2"]
                 [markdown-clj "0.9.65"]
                 [environ "1.0.0"]
                 [im.chit/cronj "1.4.3"]
                 [compojure "1.3.3"]
                 [ring/ring-defaults "0.1.4"]
                 [ring/ring-session-timeout "0.1.0"]
                 [ring-middleware-format "0.5.0"]
                 [noir-exception "0.2.3"]
                 [bouncer "0.3.2"]
                 [prone "0.8.1"]
                 [buddy "0.5.0"]
                 [org.clojure/clojurescript "0.0-3169" :scope "provided"]
                 [secretary "1.2.3"]
                 [org.clojure/core.async "0.1.346.0-17112a-alpha"]
                 [cljs-ajax "0.3.10"]
                 [org.immutant/web "2.0.0-beta2"]
                 [com.taoensso/sente "1.4.1"]]

  :min-lein-version "2.0.0"
  :uberjar-name "aleph.jar"
  :repl-options {:init-ns aleph.handler}
  :jvm-opts ["-server"]
  :jar-exclusions [#"\.cljx|\.swp|\.swo|\.DS_Store"]
  :prep-tasks [["cljx" "once"] "javac" "compile"]
  :source-paths ["src" "target/generated/clj"]

  :main aleph.core

  :plugins [[lein-ring "0.9.1"]
            [lein-environ "1.0.0"]
            [lein-ancient "0.6.5"]
            [lein-cljsbuild "1.0.4"]
            [lein-sassc "0.10.4"]]

  :sassc [{:src "resources/scss/screen.scss"
           :style "nested"
           :output-to "resources/public/css/screen.css"
           :import-path "resources/scss"}]

  :hooks [leiningen.sassc]

  :ring {:handler aleph.handler/app
         :init    aleph.handler/init
         :destroy aleph.handler/destroy
         :uberwar-name "aleph.war"}

  :clean-targets ^{:protect false} ["resources/public/js"]

  :cljsbuild
  {:builds
   {:app
    {:source-paths ["src-cljs" "target/generated/cljs"]
     :compiler
     {:output-dir "resources/public/js/out"
      :optimizations :none
      :output-to "resources/public/js/app.js"
      :pretty-print true}}}}

  :cljx
  {:builds [{:source-paths ["src-cljx"]
             :output-path "target/generated/clj"
             :rules :clj}
            {:source-paths ["src-cljx"]
             :output-path "target/generated/cljs"
             :rules :cljs}]}

  :profiles
  {:uberjar {:omit-source true
             :env {:production true}
             :hooks [leiningen.cljsbuild leiningen.sassc]
             :cljsbuild
             {:jar true
              :builds
              {:app
               {:source-paths ["env/prod/cljs"]
                :compiler {:optimizations :advanced :pretty-print false}}}}

             :aot :all}
   :dev {:dependencies [[ring-mock "0.1.5"]
                        [ring/ring-devel "1.3.2"]
                        [pjstadig/humane-test-output "0.7.0"]
                        [leiningen "2.5.1"]
                        [figwheel "0.2.5"]
                        [weasel "0.6.0"]
                        [com.cemerick/piggieback "0.2.0"]
                        [org.clojure/tools.nrepl "0.2.10"]]
         :source-paths ["env/dev/clj"]

         :plugins [[lein-figwheel "0.2.5"]
                   [lein-auto "0.1.1"]
                   [com.keminglabs/cljx "0.6.0"]]

         :cljsbuild
         {:builds
          {:app
           {:source-paths ["env/dev/cljs"] :compiler {:source-map true}}}}

         :figwheel
         {:http-server-root "public"
          :server-port 3449
          :css-dirs ["resources/public/css"]
          :ring-handler aleph.handler/app}

         :auto
         {"sassc" {:file-pattern  #"\.(scss)$"}
          "cljx" {:file-pattern #"\.(cljx)$"}}

         :repl-options {:init-ns aleph.repl}
         :injections [(require 'pjstadig.humane-test-output)
                      (pjstadig.humane-test-output/activate!)]
         :env {:dev true}}})
