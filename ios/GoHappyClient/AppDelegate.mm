#import <Firebase.h>
#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>


@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [FIRApp configure];
  self.moduleName = @"GoHappyClient";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self bundleURL];
}

- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  NSMutableDictionary *userInfo = [[NSMutableDictionary alloc] init];
  [userInfo setObject:options forKey:@"options"];
  [userInfo setObject:url forKey:@"openUrl"];
  [[NSNotificationCenter defaultCenter] postNotificationName: @"ApplicationOpenURLNotification" object:nil userInfo:userInfo];
  return YES;
}

- (NSURL *)bundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@".expo/.virtual-metro-entry"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
