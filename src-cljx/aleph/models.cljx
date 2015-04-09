(ns aleph.models)

(def sector-radius 2500)

(deftype Position [^float x ^float y ^float z]
  Object
  (toString [_]
    (format "(%f, %f, %f)" x y z)))
(deftype Index [^int x ^int y]
  Object
  (toString [_]
    (format "(%d, %d)" x y)))

(defrecord Thing [])
(defrecord Star [^Position position])
(defrecord Sector [^Index index stars])

(defn sector [index density]
  (->Sector index (into #{} (map (fn [x] (star)) (range density)))))

(defn star []
  (->Star (->Position (* sector-radius (- (rand) 0.5))
                      (* sector-radius (- (rand) 0.5))
                      (* sector-radius (- (rand) 0.5)))))

(defn hello-message []
  "Hello, world!")
