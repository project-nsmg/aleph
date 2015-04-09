(ns aleph.core
  (:require [secretary.core :as secretary]
            [ajax.core :refer [GET POST]]
            [aleph.models :as models])
  (:require-macros [secretary.core :refer [defroute]]))

(def scene (let [scene (js/THREE.Scene.)]
             (set! (.-fog scene) (js/THREE.Fog. 16r000000 1500 2100))
             scene))

(def camera (let [camera (js/THREE.PerspectiveCamera.
                          75
                          (/ (.-innerWidth js/window)
                             (.-innerHeight js/window))
                          0.1
                          5000)]
              (set! (.-z (.-position camera)) 750)
              camera))

(def material (let [map (js/THREE.ImageUtils.loadTexture "img/sprite.png")
                    material (js/THREE.SpriteMaterial. #js
                                                       {:map map
                                                        :color 16rffffff
                                                        :fog true})]
                (set! (.-minFilter js/THREE.Texture) js/THREE.LinearFilter)
                material))

(def sector (let [sector (models/sector (models/->Index 0 0) 200)]
              sector))

(def group (let [group (js/THREE.Group.)]
             (.add scene group)
             (doseq [star (:stars sector)]
               (let [sprite (js/THREE.Sprite. material)]
                 (.set (.-position sprite)
                       (.-x (:position star))
                       (.-y (:position star))
                       (.-z (:position star)))
                 (.set (.-scale sprite)
                       50 50 1)
                 (.add group sprite)))
             group))


(def renderer (let [renderer (js/THREE.WebGLRenderer.)]
                (.setSize renderer
                          (.-innerWidth js/window)
                          (.-innerHeight js/window))
                (.setPixelRatio renderer
                                (.-devicePixelRatio js/window))
                (.appendChild (.-body js/document)
                              (.-domElement renderer))
                renderer))

(defn render []
  (js/requestAnimationFrame render)
  (let [time (/ (.now js/Date) 1000)]
    (.set (.-rotation group)
          (* time 0.5 0.01)
          (* time 0.75 0.01)
          (* time 1.0 0.01)))
  (.render renderer scene camera))

(defn init! []
  (secretary/set-config! :prefix "#")
  (render))
