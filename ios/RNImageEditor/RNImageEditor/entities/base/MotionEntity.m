//
//  MotionEntity.m
//  RNImageEditor
//
//  Created by Thomas Steinbrüchel on 24.10.18.
//  Copyright © 2018 Terry. All rights reserved.
//

#import "MotionEntity.h"

@implementation MotionEntity
{
}

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
                     entityStrokeColor: (UIColor *)entityStrokeColor {

    self = [super initWithFrame:CGRectMake(parentCenterX, parentCenterY, width, height)];

    if (self) {
        self.parentWidth = parentWidth;
        self.parentHeight = parentHeight;
        self.isSelected = false;
        self.centerPoint = CGPointMake(parentCenterX, parentCenterY);
        self.scale = 1.0;
        self.MIN_SCALE = 0.15f;
        self.MAX_SCALE = 4.5f;
        self.parentScreenScale = parentScreenScale;
        self.borderStyle = borderStyle;
        self.borderStrokeWidth = borderStrokeWidth;
        self.bordersPadding = bordersPadding;
        self.borderStrokeColor = borderStrokeColor;
        self.entityStrokeWidth = entityStrokeWidth;
        self.entityStrokeColor = entityStrokeColor;

        self.backgroundColor = [UIColor clearColor];
        self.entityId = [[NSUUID UUID] UUIDString];
    }
    return self;
}

- (BOOL)isEntitySelected {
    return self.isSelected;
}

- (BOOL)isPointInEntity:(CGPoint)point {
    return CGRectContainsPoint(self.frame, point);
}

- (void)setIsSelected:(BOOL)isSelected {
    _isSelected = isSelected;
}

- (void)rotateEntityBy:(CGFloat)rotationInRadians {
    [self setTransform:CGAffineTransformRotate(self.transform, rotationInRadians)];
}

- (void)moveEntityTo:(CGPoint)locationDiff {
    [self setTransform:CGAffineTransformTranslate(self.transform, locationDiff.x, locationDiff.y)];
    self.centerPoint = self.center;
}

- (void)scaleEntityBy:(CGFloat)newScale {
    CGFloat absoluteScale = self.scale * newScale;
    if (absoluteScale >= self.MIN_SCALE && absoluteScale <= self.MAX_SCALE) {
        self.scale *= newScale;
        [self setTransform:CGAffineTransformScale(self.transform, newScale, newScale)];
        [self setContentScaleFactor:self.parentScreenScale * self.scale]; // Make it sharp :-)
    }
}

- (void)updateStrokeSettings: (enum BorderStyle)borderStyle
           borderStrokeWidth: (CGFloat)borderStrokeWidth
           borderStrokeColor: (UIColor *)borderStrokeColor
           entityStrokeWidth: (CGFloat)entityStrokeWidth
           entityStrokeColor: (UIColor *)entityStrokeColor {

    if (self.isSelected) {
        self.borderStyle = borderStyle;
        self.borderStrokeWidth = borderStrokeWidth;
        self.borderStrokeColor = borderStrokeColor;
        self.entityStrokeWidth = entityStrokeWidth;
        self.entityStrokeColor = entityStrokeColor;
    }
}

- (void)drawRect:(CGRect)rect {
    CGContextRef contextRef = UIGraphicsGetCurrentContext();
    if (contextRef) {
        CGContextSaveGState(contextRef);
        if ([self respondsToSelector:@selector(drawContent:withinContext:)]) {
            [self drawContent:rect withinContext:contextRef];
        }
        CGContextRestoreGState(contextRef);
    }

    // Draw Border
    if (self.isSelected) {
        if (contextRef) {
            CGContextSaveGState(contextRef);

            CGContextSetLineWidth(contextRef, self.borderStrokeWidth / self.scale);
            CGContextSetStrokeColorWithColor(contextRef, [self.borderStrokeColor CGColor]);
            if (self.borderStyle == DASHED) {
                CGFloat dashPattern[]= {2.5, 2.5};
                CGContextSetLineDash(contextRef, 0.0, dashPattern, 2);
            }
            CGContextStrokeRect(contextRef, rect);

            CGContextRestoreGState(contextRef);
        }
    }
}

- (void)drawContent:(CGRect)rect withinContext:(CGContextRef)contextRef {
    NSAssert(NO, @"This is an abstract method and should be overridden");
}


/**
 * Execute undo operation on the entity if possible. By default return false.
 * @return true in case of event handled; false - otherwise, entity could be removed;
 */
- (BOOL)undo{
    return false;
}

- (int)getDrawingStep {
    return DEFAULT_DRAWING_STEP;
}

- (NSString *)getShapeType {
    return nil;
}

- (NSString *)getEntityId {
    return self.entityId;
}

- (void)setMeasuredSize:(NSInteger)width withHeight:(NSInteger)height {
    self.measuredWidth = width;
    self.measuredHeight = height;
}

@end
