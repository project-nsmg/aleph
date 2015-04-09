(ns aleph.models)

(deftype Position [^float x ^float y ^float z])
(deftype Index [^int x ^int y])

(defrecord Thing [])
(defrecord Star [^Position position ^Sector sector])
(defrecord Sector [^Index index])

(defn hello-message []
  "Hello, world!")
