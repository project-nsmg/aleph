(ns aleph.models
  (:require [aleph.helpers :refer [add-listener fire-event]]))

(def sector-radius 2500)

(defn on-create-star [fn]
  (add-listener :on-create-star fn))

(defn on-destroy-star [fn]
  (add-listener :on-destroy-star fn))

(deftype Position [^float x ^float y ^float z]
  Object
  (toString [_]
    (str "(" x "," y "," z "," ")")))
(deftype Index [^int x ^int y]
  Object
  (toString [_]
    (str "(" x "," y ")")))

(defrecord Thing [])
(defrecord Star [^Position position])
(defrecord Sector [^Index index stars])

(defn sector [index density]
  (->Sector index (into #{} (map (fn [x] (star)) (range density)))))

(defn star []
  (let [star (->Star (->Position (* sector-radius (- (rand) 0.5))
                                 (* sector-radius (- (rand) 0.5))
                                 (* sector-radius (- (rand) 0.5))))]
    (fire-event :on-create-star star)
    star))

(defn hello-message []
  "Hello, world!")
