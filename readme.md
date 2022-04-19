dans  platform>android remplacer

 apply plugin: com.google.gms.googleservices.GoogleServicesPlugin

par 

    ext.postBuildExtras = {
    apply plugin: com.google.gms.googleservices.GoogleServicesPlugin
}