// Define a properties array that returns array of objects representing
// the accepted properties for your application
var properties = [
  {type: 'boolean', id: 'Replace Existing', value: false}
];

var getSelectedVolumes = function(volumes, selectedVolumeIds){
  return volumes.filter(function(volume){
    return selectedVolumeIds.indexOf(volume.id) >= 0;
  });
};

// Define an executor function that builds an array of volumes,
// and passes it to the provided success callback, or invokes the failure
// callback if unable to do so
var executor = function(args, success, failure) {
  var params = args.params;

  var removeExisting = params['Replace Existing'];
  var newVolumes = [];
  var selectedVolumes = getSelectedVolumes(args.volumes, args.selectedVolumeIds);

  /* filter out non ellipse */
  selectedVolumes = selectedVolumes.filter(function(item){ return ['path','ellipse'].indexOf(item.shape.type) >= 0; });
  
  if (selectedVolumes.length === 0){
    return failure('No Circles found in selection');
  }
  
  selectedVolumes.forEach(function(selectedVolume){
    newVolumes.push({
      shape: {
          type: 'drill',
          center: {
            x: selectedVolume.shape.center.x,
            y: selectedVolume.shape.center.y
          },
          flipping: {},
          rotation: 0
      },
      cut: {
         type: 'drill',
         depth: selectedVolume.cut.depth,
         outlineStyle: 'on-path',
         tabPreference: false
      }
    });
    
    if (removeExisting){
      newVolumes.push({
        id: selectedVolume.id
      });
    }
   
  });

  return success(newVolumes);
};
