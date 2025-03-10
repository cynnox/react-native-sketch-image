package com.wwimmo.imageeditor.utils.entities;

import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Rect;
import android.graphics.RectF;
import android.text.Layout;
import android.text.StaticLayout;
import android.text.TextPaint;

import androidx.annotation.IntRange;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.wwimmo.imageeditor.utils.layers.TextLayer;

public class TextEntity extends MotionEntity {

    private static final int CORNER_RADIUS = 8;
    private static final int BORDER_WIDTH = 1;
    private static final int BORDER_PADDING = 16;
    private static final int BORDER_COLOR = Color.parseColor("#1B5FA7");
    private final TextPaint textPaint;
    @Nullable
    private Bitmap bitmap;
    private final Paint backgroundPaint;


    public TextEntity(@NonNull TextLayer textLayer,
                      @IntRange(from = 1) int canvasWidth,
                      @IntRange(from = 1) int canvasHeight) {
        super(textLayer, canvasWidth, canvasHeight);

        this.textPaint = new TextPaint(Paint.ANTI_ALIAS_FLAG);
        this.backgroundPaint = new Paint(Paint.ANTI_ALIAS_FLAG);

        updateEntity(false);
    }

    private void updateEntity(boolean moveToPreviousCenter) {
        Bitmap newBmp = configureTextBitmap(null, bitmap);

        // recycle previous bitmap (if not reused) as soon as possible
        if (bitmap != null && bitmap != newBmp && !bitmap.isRecycled()) {
            bitmap.recycle();
        }

        this.bitmap = newBmp;

        float width = bitmap.getWidth();
        float height = bitmap.getHeight();

        @SuppressWarnings("UnnecessaryLocalVariable")
        float widthAspect = 1.0F * canvasWidth / width;

        // for text we always match text width with parent width
        this.holyScale = widthAspect;

        // initial position of the entity
        srcPoints[0] = 0;
        srcPoints[1] = 0;
        srcPoints[2] = width;
        srcPoints[3] = 0;
        srcPoints[4] = width;
        srcPoints[5] = height;
        srcPoints[6] = 0;
        srcPoints[7] = height;
        srcPoints[8] = 0;
        srcPoints[8] = 0;

        if (moveToPreviousCenter) {
            moveCenterTo(absoluteCenter());
        }
    }

    private Bitmap configureTextBitmap(@Nullable Paint paint, @Nullable Bitmap reuseBmp) {
        updatePaint(paint);

        // substracting 25% of the width so the border around the entity is closer to the text
        int boundsWidth = (canvasWidth / 100) * 60;

        // init params - size, color, typeface
        TextLayer layer = getLayer();
        textPaint.setStyle(Paint.Style.FILL);
        textPaint.setTextSize(layer.getFont().getSize() * canvasWidth);
        textPaint.setColor(layer.getFont().getColor());
        textPaint.setTypeface(layer.getFont().getTypeface());

        // drawing text guide : http://ivankocijan.xyz/android-drawing-multiline-text-on-canvas/
        // Static layout which will be drawn on canvas
        StaticLayout sl = new StaticLayout(
                layer.getText(), // - text which will be drawn
                textPaint,
                boundsWidth, // - width of the layout
                Layout.Alignment.ALIGN_CENTER, // - layout alignment
                1, // 1 - text spacing multiply
                1, // 1 - text spacing add
                true); // true - include padding
        // calculate height for the entity, min - Limits.MIN_BITMAP_HEIGHT
        int boundsHeight = sl.getHeight();

        // create bitmap not smaller than TextLayer.Limits.MIN_BITMAP_HEIGHT
        int bmpHeight = (int) (canvasHeight * Math.max(TextLayer.Limits.MIN_BITMAP_HEIGHT,
                1.0F * boundsHeight / canvasHeight));

        // create bitmap where text will be drawn
        Bitmap bmp;
        if (reuseBmp != null && reuseBmp.getWidth() == boundsWidth
                && reuseBmp.getHeight() == bmpHeight) {
            // if previous bitmap exists, and it's width/height is the same - reuse it
            bmp = reuseBmp;
            bmp.eraseColor(Color.TRANSPARENT); // erase color when reusing
        } else {
            bmp = Bitmap.createBitmap(boundsWidth, bmpHeight, Bitmap.Config.ARGB_8888);
        }

        Canvas canvas = new Canvas(bmp);
        canvas.save();

        // move text to center if bitmap is bigger that text
        if (boundsHeight < bmpHeight) {
            //calculate Y coordinate - In this case we want to draw the text in the
            //center of the canvas so we move Y coordinate to center.
            float textYCoordinate = (bmpHeight - boundsHeight) / 2;
            canvas.translate(0, textYCoordinate);
        }

        // draw background
        Rect textRect = new Rect();
        textPaint.getTextBounds(layer.getText(), 0, layer.getText().length(), textRect);
        // Add padding and centring
        int startX = Math.max ((boundsWidth - textRect.width()) / 2 - BORDER_PADDING, 0);
        int startY = BORDER_PADDING;
        int endX = Math.min(startX + textRect.width() + 2 * BORDER_PADDING, boundsWidth);
        int endY = Math.min(startY + boundsHeight , boundsHeight);
        RectF backgroundRect = new RectF(startX, startY, endX, endY);
        drawBackground(canvas, backgroundRect);

        //draws static layout on canvas
        sl.draw(canvas);
        canvas.restore();

        return bmp;
    }

    private void drawBackground(Canvas canvas, RectF rectF) {
        this.backgroundPaint.setColor(Color.WHITE);
        this.backgroundPaint.setStyle(Paint.Style.FILL);
        canvas.drawRoundRect(rectF, CORNER_RADIUS, CORNER_RADIUS, backgroundPaint);
        this.backgroundPaint.setStyle(Paint.Style.STROKE);
        this.backgroundPaint.setColor(BORDER_COLOR);
        this.backgroundPaint.setStrokeWidth(BORDER_WIDTH);
        this.backgroundPaint.setStrokeCap(Paint.Cap.ROUND);
        canvas.drawRoundRect(rectF, CORNER_RADIUS, CORNER_RADIUS, backgroundPaint);

    }

    private void updatePaint(@Nullable Paint paint) {
        if (paint != null && isSelected()) {
            int color = paint.getColor();
            getLayer().getFont().setColor(color);
            textPaint.setColor(color);
        }
    }

    @Override
    protected void drawContent(@NonNull Canvas canvas, @Nullable Paint drawingPaint) {
        bitmap = configureTextBitmap(drawingPaint, bitmap);
        if (bitmap != null) {
            canvas.drawBitmap(bitmap, matrix, drawingPaint);
        }
    }

    @Override
    @NonNull
    public TextLayer getLayer() {
        return (TextLayer) layer;
    }

    @Override
    public int getWidth() {
        return bitmap != null ? bitmap.getWidth() : 0;
    }

    @Override
    public int getHeight() {
        return bitmap != null ? bitmap.getHeight() : 0;
    }

    public void updateEntity() {
        updateEntity(true);
    }

    @Override
    public void release() {
        if (bitmap != null && !bitmap.isRecycled()) {
            bitmap.recycle();
        }
    }

    @Override
    public String getShapeType() {
        return EntityType.TEXT.label;
    }
}
