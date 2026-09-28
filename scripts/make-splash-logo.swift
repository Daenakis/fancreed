// Builds assets/splash-logo.png for the native splash (expo-splash-screen).
//
// The splash plugin treats its image as a square (imageWidth × imageWidth)
// and stretches anything else. So the club logo is centred on a transparent
// square canvas as tall as the logo: in app.config.ts `imageWidth` is then
// the logo's on-screen height (156 = CLUB_LOGO_WIDTH 120 / logo aspect), the
// same size the JS splash draws it at, so the hand-over doesn't jump.
//
// Run again whenever assets/exampleLogo.png (the club logo) changes:
//   swift scripts/make-splash-logo.swift
import AppKit

let root = URL(fileURLWithPath: #filePath).deletingLastPathComponent().deletingLastPathComponent()
let source = root.appendingPathComponent("assets/exampleLogo.png")
let output = root.appendingPathComponent("assets/splash-logo.png")

guard let rep = NSBitmapImageRep(data: try Data(contentsOf: source)), let logo = rep.cgImage else {
  fatalError("Can't read \(source.path)")
}
let side = max(logo.width, logo.height)
let ctx = CGContext(
  data: nil, width: side, height: side, bitsPerComponent: 8, bytesPerRow: 0,
  space: CGColorSpaceCreateDeviceRGB(),
  bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!
ctx.interpolationQuality = .high
ctx.draw(logo, in: CGRect(
  x: (side - logo.width) / 2, y: (side - logo.height) / 2,
  width: logo.width, height: logo.height))
try NSBitmapImageRep(cgImage: ctx.makeImage()!)
  .representation(using: .png, properties: [:])!
  .write(to: output)
print("Wrote \(output.path) (\(side)×\(side), logo \(logo.width)×\(logo.height))")
print("Splash imageWidth = CLUB_LOGO_WIDTH × \(side) / \(logo.width) = \(Int((120.0 * Double(side) / Double(logo.width)).rounded()))")
