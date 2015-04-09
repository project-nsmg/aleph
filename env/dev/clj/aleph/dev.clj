(ns aleph.dev
  (:require [cemerick.piggieback :as piggieback]
            [weasel.repl.websocket :as weasel]
            [leiningen.core.main :as lein]
            [clojure.java.shell :refer [sh]]))

(defn browser-repl []
  (piggieback/cljs-repl :repl-env (weasel/repl-env :ip "127.0.0.1" :port 9001)))

(defn start-figwheel []
  (future
    (println "Starting figwheel.")
    (lein/-main ["figwheel"])))

(defn start-auto-sass []
  (future
    (println "Starting auto sass.")
    (sh "lein" "auto" "sassc" "once")))

(defn start-auto-cljx []
  (future
    (println "Starting auto cljx.")
    (sh "lein" "auto" "cljx")))

(defn start-autoreload []
  (start-figwheel)
  (start-auto-cljx)
  (start-auto-sass))
