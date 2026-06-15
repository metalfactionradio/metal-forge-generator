# Add project specific ProGuard rules here.
# You can control the set of the applied configuration files using the
# proguardFiles setting in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# If your project uses WebView with JS, uncomment the following
# and specify the fully qualified class name to the JavaScript interface
# class:
#-keepclassmembers class fqcn.of.javascript.interface.for.webview {
#   public *;
#}

# Uncomment this to preserve the line number information for
# debugging stack traces.
#-keepattributes SourceFile,LineNumberTable

# If you keep the line number information, uncomment this to
# hide the original source name.
#-renamesourcefileattribute SourceFile

# ---------------------------------------------------------------
# Capacitor — required to prevent R8 from stripping the native
# bridge in release builds. Without these rules, window.Capacitor
# is undefined at runtime even though BridgeActivity is correct.
# ---------------------------------------------------------------
-keep class com.getcapacitor.** { *; }
-keep @com.getcapacitor.annotation.CapacitorPlugin public class * {
    @com.getcapacitor.annotation.PermissionCallback <methods>;
    @com.getcapacitor.annotation.ActivityCallback <methods>;
    @com.getcapacitor.annotation.PluginMethod <methods>;
    public <init>();
}
-keep class com.revenuecat.** { *; }
-keep class com.android.billingclient.** { *; }
-keepattributes JavascriptInterface
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}