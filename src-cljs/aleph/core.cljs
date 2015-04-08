(ns aleph.core
  (:require [secretary.core :as secretary]
            [ajax.core :refer [GET POST]])
  (:require-macros [secretary.core :refer [defroute]]))

(def scene (js/THREE.Scene.))
(def camera (js/THREE.PerspectiveCamera. 75
                                         (/ (.-innerWidth js/window)
                                            (.-innerHeight js/window))
                                         0.1
                                         1000))
(def renderer (js/THREE.WebGLRenderer.))

(.setSize renderer
          (.-innerWidth js/window)
          (.-innerHeight js/window))
(.appendChild (.-body js/document) (.-domElement renderer))

(def geometry (js/THREE.BoxGeometry. 2 2 2))
(def material (js/THREE.MeshBasicMaterial. #js {:color 16r00ff00}))
(def cube (js/THREE.Mesh. geometry material))
(.add scene cube)

(set! (.-z (.-position camera)) 5)

(defn render []
  (js/requestAnimationFrame render)
  (set! (.-x (.-rotation cube))
        (+ (.-x (.-rotation cube)) 0.1))
  (set! (.-y (.-rotation cube))
        (+ (.-y (.-rotation cube)) 0.1))
  (.render renderer scene camera))

(defn init! []
  (secretary/set-config! :prefix "#")
  (println "Hello world!")
  (render))
