//
//  MotionEntity.h
//  RNImageEditor
//
//  Created by Thomas Steinbrüchel on 23.10.18.
//  Copyright © 2018 Terry. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import "Enumerations.h"

@protocol MotionEntityProtocol
- (void)drawContent:(CGRect)rect withinContext: (CGContextRef)contextRef;
@end

static const int DEFAULT_DRAWING_STEP = -1 ;

@interface MotionEntity : UIView <MotionEntityProtocol>

@property (nonatomic) BOOL isSelected;
@property (nonatomic) CGPoint centerPoint;
@property (nonatomic) CGFloat scale;
@property (nonatomic) CGFloat MIN_SCALE;
@property (nonatomic) CGFloat MAX_SCALE;
@property (nonatomic) CGFloat parentScreenScale;
@property (nonatomic) NSInteger parentWidth;
@property (nonatomic) NSInteger parentHeight;
@property (nonatomic) enum BorderStyle borderStyle;
@property (nonatomic) CGFloat bordersPadding;
@property (nonatomic) CGFloat borderStrokeWidth;
@property (nonatomic) UIColor* borderStrokeColor;
@property (nonatomic) CGFloat entityStrokeWidth;
@property (nonatomic) UIColor* entityStrokeColor;
@property (nonatomic) NSString* entityId;
@property (nonatomic) NSInteger measuredWidth;
@property (nonatomic) NSInteger measuredHeight;


- (instancetype)initAndSetupWithParent: (NSInteger)parentWidth
                          parentHeight: (NSInteger)parentHeight
                         parentCenterX: (CGFloat)parentCenterX
                         parentCenterY: (CGFloat)parentCenterY
                     parentScreenScale: (CGFloat)parentScreenScale
                                 width: (NSInteger)width
                                height: (NSInteger)height
                        bordersPadding: (CGFloat)bordersPadding
                           borderStyle: (enum BorderStyle)borderStyle
                     borderStrokeWidth: (CGFloat)borderStrokeWidth
                     borderStrokeColor: (UIColor *)borderStrokeColor
                     entityStrokeWidth: (CGFloat)entityStrokeWidth
                     entityStrokeColor: (UIColor *)entityStrokeColor;

- (BOOL)isEntitySelected;
- (BOOL)isPointInEntity:(CGPoint)point;
- (void)setIsSelected:(BOOL)isSelected;
- (void)rotateEntityBy:(CGFloat)rotationInRadians;
- (void)moveEntityTo:(CGPoint)locationDiff;
- (void)scaleEntityBy:(CGFloat)newScale;
- (void)updateStrokeSettings: (enum BorderStyle)borderStyle
           borderStrokeWidth: (CGFloat)borderStrokeWidth
           borderStrokeColor: (UIColor *)borderStrokeColor
           entityStrokeWidth: (CGFloat)entityStrokeWidth
           entityStrokeColor: (UIColor *)entityStrokeColor;
- (BOOL)undo;
- (int)getDrawingStep;
- (NSString *)getShapeType;
- (NSString *)getEntityId;
- (void)setMeasuredSize: (NSInteger)width withHeight:(NSInteger)height;

@end
