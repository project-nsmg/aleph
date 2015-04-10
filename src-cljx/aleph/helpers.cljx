(ns aleph.helpers)

(let [listeners (atom {})]

  (defn add-listener [event listener]
    (if (not (contains? @listeners event))
      (swap! listeners assoc event #{}))
    (swap! listeners update-in [event] conj listener))

  (defn remove-listener [event listener]
    (if (contains? @listeners event)
      (swap! listeners update-in [event] disj listener)
      (if (empty (event @listeners))
        (swap! listeners dissoc event))))

  (defn fire-event [event & params]
    (doseq [fn (event @listeners)]
      (apply fn params))))
