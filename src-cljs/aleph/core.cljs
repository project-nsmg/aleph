(ns aleph.core
  (:require [secretary.core :as secretary]
            [ajax.core :refer [GET POST]]
            [aleph.models :as models]
            [aleph.helpers :refer [add-listener fire-event]])
  (:require-macros [secretary.core :refer [defroute]]))

(defn on-update [fn]
  (add-listener :on-update fn))

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

(def renderer (let [renderer (js/THREE.WebGLRenderer.)]
                (.setSize renderer
                          (.-innerWidth js/window)
                          (.-innerHeight js/window))
                (.setPixelRatio renderer
                                (.-devicePixelRatio js/window))
                (.appendChild (.-body js/document)
                              (.-domElement renderer))
                renderer))

(def stars
  (let [group (let [group (js/THREE.Group.)]
                (.add scene group)
                group)
        material (let [map (js/THREE.ImageUtils.loadTexture "img/sprite.png")
                       material (js/THREE.SpriteMaterial. #js
                                                          {:map map
                                                           :color 16rffffff
                                                           :fog true})]
                   (set! (.-minFilter js/THREE.Texture) js/THREE.LinearFilter)
                   material)]
    (models/on-create-star (fn [star]
                      (let [sprite (js/THREE.Sprite. material)]
                        (.set (.-position sprite)
                              (.-x (:position star))
                              (.-y (:position star))
                              (.-z (:position star)))
                        (.set (.-scale sprite)
                              50 50 1)
                        (.add group sprite))))
    (on-update (fn []
                 (let [time (/ (.now js/Date) 1000)]
                   (.set (.-rotation group)
                         (* time 0.5 0.01)
                         (* time 0.75 0.01)
                         (* time 1.0 0.01)))))
    group))

(def sector (let [sector (models/sector (models/->Index 0 0) 200)]
              sector))

(defn render []
  (js/requestAnimationFrame render)
  (fire-event :on-update)
  (.render renderer scene camera))

(defn init! []
  (secretary/set-config! :prefix "#")
  (render))
