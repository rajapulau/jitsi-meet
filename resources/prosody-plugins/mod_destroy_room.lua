
log('info', 'Loaded destroy plugin');
module:hook("muc-occupant-left", function(event)
  log('info', 'destroy room')
  --FIRE OTHER PARTICIPANTS FIRST
  --event.room:clear();
  --Destroy Room
  event.room:destroy();
end,150)
